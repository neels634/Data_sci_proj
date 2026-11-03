/**
 * Copies text to the phone's clipboard. navigator.clipboard only exists on https and localhost, so a
 * phone reaching a laptop over Wi-Fi needs the older way. Throws if neither works.
 */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const box = document.createElement("textarea");
  box.value = text;
  box.setAttribute("readonly", "");
  box.style.position = "fixed";
  box.style.opacity = "0";
  document.body.appendChild(box);
  box.select();
  const copied = document.execCommand("copy");
  box.remove();
  if (!copied) throw new Error("copy failed");
}
