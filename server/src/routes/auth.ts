import { AES } from "crypto-js";
import { Router } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import fetch, { Headers } from "node-fetch";
import path from "path";
import { __milliseconds__ } from "src/constants";
import { User } from "src/entities/User";
import { hex, uuid } from "src/utils/ids";

const auth = Router();

const privateKey = fs.readFileSync(
  path.join(__dirname, "..", "..", process.env.PRIVATE_KEY!),
  "utf8"
);

auth.get("/github", (req, res) => {
  const state = hex(16);

  res.cookie("state", state, {
    encode: (cookie) =>
      AES.encrypt(cookie, process.env.STATE_SECRET!).toString(),
    httpOnly: true,
    maxAge: 1000 * 60 * 10,
    sameSite: "lax",
  });

  return res.redirect(
    `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: process.env.GH_CLIENT_ID!,
      redirect_uri: process.env.GH_CALLBACK!,
      state,
    }).toString()}`
  );
});

auth.get("/github/callback", async (req, res) => {
  try {
    if (!req.query.code)
      return res.status(401).json({ error: "no authorization code" });

    const { access_token } = await (
      await fetch(
        `https://github.com/login/oauth/access_token?${new URLSearchParams({
          client_id: process.env.GH_CLIENT_ID!,
          client_secret: process.env.GH_CLIENT_SECRET!,
          code: req.query.code!.toString(),
          redirect_uri: process.env.GH_CALLBACK!,
        }).toString()}`,
        {
          method: "POST",
          headers: new Headers([["Accept", "application/json"]]),
        }
      )
    ).json();

    if (!access_token)
      return res.status(500).json({ error: "unable to obtain access token" });

    const { id, login, name, bio, avatar_url } = await (
      await fetch(`https://api.github.com/user`, {
        headers: new Headers([["Authorization", `token ${access_token}`]]),
      })
    ).json();

    if (!id)
      return res.status(500).json({ error: "unable to obtain user info" });

    const user =
      (await User.findOne({ where: { githubId: id } })) ??
      User.create({
        id: uuid(),
        username: login,
        displayName: name,
        description: bio,
        avatar: avatar_url,
        githubId: id,
      });

    user.username = login;
    user.displayName = name;
    user.description = bio;
    user.avatar = avatar_url;
    user.githubId = id;

    await user.save();

    const token = jwt.sign(
      {
        role: user.role,
        id: user.id,
        github: user.githubId,
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: __milliseconds__.DAY,
      }
    );

    return res.redirect(
      `${process.env.CLIENT_ADDRESS}/?${new URLSearchParams({
        token,
      }).toString()}`
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "internal server error" });
  }
});

export default auth;
