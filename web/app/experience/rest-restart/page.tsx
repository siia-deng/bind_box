import type { Metadata } from "next";
import { RestRestartApp } from "./RestRestartApp";

export const metadata: Metadata = {
  title: "REST 重启人格测试 · Hurdle Club",
  description: "一个带 Dream Board 联动的第二人生人格测试小游戏。",
  openGraph: {
    title: "REST 重启人格测试",
    description: "测出你的重启人格代码，生成第二人生建议与梦板视觉线索。",
    type: "website"
  }
};

export default function RestRestartPage() {
  return <RestRestartApp />;
}
