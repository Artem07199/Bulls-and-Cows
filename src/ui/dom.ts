export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: {
    className?: string;
    textContent?: string;
    disabled?: boolean;
    type?: string;
    value?: string;
    placeholder?: string;
  } = {},
  children: readonly HTMLElement[] = []
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (props.className) element.className = props.className;
  if (props.textContent !== undefined) element.textContent = props.textContent;
  if (props.disabled !== undefined) (element as HTMLButtonElement).disabled = props.disabled;
  if (props.type && "type" in element) (element as HTMLInputElement).type = props.type;
  if (props.value && "value" in element) (element as HTMLInputElement).value = props.value;
  if (props.placeholder && "placeholder" in element)
    (element as HTMLInputElement).placeholder = props.placeholder;

  children.forEach((child) => element.appendChild(child));
  return element;
};
