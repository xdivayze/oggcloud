export type LibraryObjectType = "picture" | "video" | "raw" | "folder";

export interface LibraryObj {
    altText: string,
    type : LibraryObjectType,
    id: number,
    splashUrl: string,
    realSizeKB: number,
}

export interface LibraryObjOpenable extends LibraryObj{
    open(): Error;
}

