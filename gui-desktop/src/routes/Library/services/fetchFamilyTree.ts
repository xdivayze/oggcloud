import { FETCH_FAMILY_TREE_ENDPOINT } from "../../../api/library";
import axios from "axios";

export function fetchFamilyTree(id: number) {
  return axios
    .get<{ tree: number[] }>(FETCH_FAMILY_TREE_ENDPOINT, {
      params: {
        id,
      },
    })
    .then((v) => {
      if (v.status !== 200) return null;
      return v.data.tree;
    });
}
