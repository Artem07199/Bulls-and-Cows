export const el = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);
    if (props.className)
        element.className = props.className;
    if (props.textContent !== undefined)
        element.textContent = props.textContent;
    if (props.disabled !== undefined)
        element.disabled = props.disabled;
    if (props.type && "type" in element)
        element.type = props.type;
    if (props.value && "value" in element)
        element.value = props.value;
    if (props.placeholder && "placeholder" in element)
        element.placeholder = props.placeholder;
    children.forEach((child) => element.appendChild(child));
    return element;
};
