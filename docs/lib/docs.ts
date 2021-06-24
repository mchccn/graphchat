import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remark from "remark";
import html from "remark-html";

const docsDirectory = path.join(process.cwd(), "docs");

export function getSortedDocsData() {
  const fileNames = fs.readdirSync(docsDirectory);
  const allDocsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(docsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { index: number; date: string; title: string }),
    };
  });

  return allDocsData.sort((a, b) => {
    if (a.index < b.index) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllDocsIds() {
  const fileNames = fs.readdirSync(docsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getDocData(id: string) {
  const fullPath = path.join(docsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { index: string; date: string; title: string }),
  };
}
