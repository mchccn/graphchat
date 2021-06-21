import { stripIndent } from "common-tags";
import fetch, { Headers } from "node-fetch";
import { User } from "src/entities/User";
import logger from "./logging";

export async function modlog({
  type,
  meta,
  offender,
  moderator,
  reason,
}: {
  type: "ban";
  meta: { case: number };
  offender: User;
  moderator: User;
  reason?: string;
}) {
  console.log(
    type.length +
      1 +
      Math.abs(offender.username.length - moderator.username.length)
  );

  const spacing = Math.abs(
    offender.username.length - moderator.username.length
  );

  const response = await fetch(
    `https://discord.com/api/webhooks/856612144183377981/sgPTPgS0_gaOJ35P8bOaiuuT-0BymH3wGqvMto9XDTHIFdeNycZDHun5bLWdhAKSJQWp`,
    {
      method: "POST",
      headers: new Headers([["Content-Type", "application/json"]]),
      body: JSON.stringify({
        content: stripIndent`
        \`\`\`
        Case ${meta.case} ${" ".repeat(
          9 - "Case ".length - meta.case.toString().length
        )}- ${type.toUpperCase()}
        Offender  : ${offender.username} (${offender.id})
        Moderator : ${moderator.username} ${" ".repeat(spacing)}(${
          moderator.id
        })
        ${reason ? `Reason    : ${reason}` : ""}
        \`\`\`
        `,
      }),
    }
  ).catch(() => logger.error(`Failed to execute modlog webhook.`));

  if (!response) return false;

  return response.ok;
}
