import { ref } from "vue";
import { useDebounce } from "./useDebounce";
import { useStocksStore } from "@/stores/stocks";

export function useStockSearch() {
  const keyword = ref("");
  const stocksStore = useStocksStore();

  function doSearch() {
    const trimmed = keyword.value.trim();
    if (trimmed) {
      stocksStore.search(trimmed);
    }
  }

  const { debounced: debouncedSearch } = useDebounce(doSearch, 500);

  function onInput() {
    debouncedSearch();
  }

  function onSubmit() {
    doSearch();
  }

  return { keyword, onInput, onSubmit };
}
