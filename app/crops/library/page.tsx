import { redirect } from "next/navigation";

/** The library lives as a tab of My Farm. */
export default function LibraryIndex() {
  redirect("/crops?tab=library");
}
