export function createPath(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}