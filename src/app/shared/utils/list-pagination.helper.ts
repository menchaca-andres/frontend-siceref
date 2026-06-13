export function removeItemAndFixPage<T>(
    items: T[],
    page: number,
    pageSize: number,
    shouldRemove: (item: T) => boolean,
): { items: T[]; page: number } {
    const nextItems = items.filter((item) => !shouldRemove(item))
    const maxPage = Math.max(1, Math.ceil(nextItems.length / pageSize))

    return {
        items: nextItems,
        page: Math.min(page, maxPage),
    }
}
