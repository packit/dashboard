export function useTitle(title: string) {
    document.title = "Packit Service" + title ? ` - ${title}` : "";
}
