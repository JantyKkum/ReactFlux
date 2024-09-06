import { computed, map } from "nanostores";
import { removeDuplicateEntries } from "../utils/deduplicate";
import { filterEntries } from "../utils/filter";
import { createSetter } from "../utils/nanostores";
import { hiddenFeedIdsState } from "./dataState";
import { getSettings, settingsState } from "./settingsState";

export const contentState = map({
  activeContent: null, // 当前打开的文章
  entries: [], // 接口返回的所有文章
  filterStatus: getSettings("showStatus"), // all | unread
  filterString: "", // 搜索文本
  filterType: "Title", // title | content | author
  infoFrom: getSettings("homePage"), // all | today | starred | history
  isArticleFocused: false, // 文章是否被聚焦
  loading: true, // 初始 loading
  loadMoreUnreadVisible: false, // unread 页签加载更多按钮可见性
  loadMoreVisible: false, // all 页签加载更多按钮可见性
  offset: 0, // 所有文章分页参数
  total: 0, // 接口返回文章总数原始值，不受接口返回数据长度限制
  unreadCount: 0, // 接口返回未读文章数原始值，不受接口返回数据长度限制
  unreadEntries: [], // 接口返回的未读文章
  unreadOffset: 0, // 未读文章分页参数
});

export const filteredEntriesState = computed(
  [contentState, hiddenFeedIdsState, settingsState],
  (content, hiddenFeedIds, settings) => {
    const {
      entries,
      filterStatus,
      filterString,
      filterType,
      infoFrom,
      unreadEntries,
    } = content;
    const currentEntries = filterStatus === "all" ? entries : unreadEntries;
    const filteredEntries = filterEntries(
      currentEntries,
      filterType,
      filterString,
    );

    const { removeDuplicates, showAllFeeds } = settings;
    const isValidFilter = ["all", "today", "category"].includes(infoFrom);
    const isVisible = (entry) =>
      showAllFeeds || !hiddenFeedIds.includes(entry.feed.id);
    const visibleEntries = isValidFilter
      ? filteredEntries.filter(isVisible)
      : entries;

    if (
      filterStatus === "all" ||
      removeDuplicates === "none" ||
      ["starred", "history"].includes(infoFrom)
    ) {
      return visibleEntries;
    }
    return removeDuplicateEntries(visibleEntries, removeDuplicates);
  },
);

export const setActiveContent = createSetter(contentState, "activeContent");
export const setEntries = createSetter(contentState, "entries");
export const setFilterStatus = createSetter(contentState, "filterStatus");
export const setFilterString = createSetter(contentState, "filterString");
export const setFilterType = createSetter(contentState, "filterType");
export const setInfoFrom = createSetter(contentState, "infoFrom");
export const setIsArticleFocused = createSetter(
  contentState,
  "isArticleFocused",
);
export const setLoading = createSetter(contentState, "loading");
export const setLoadMoreUnreadVisible = createSetter(
  contentState,
  "loadMoreUnreadVisible",
);
export const setLoadMoreVisible = createSetter(contentState, "loadMoreVisible");
export const setOffset = createSetter(contentState, "offset");
export const setTotal = createSetter(contentState, "total");
export const setUnreadCount = createSetter(contentState, "unreadCount");
export const setUnreadEntries = createSetter(contentState, "unreadEntries");
export const setUnreadOffset = createSetter(contentState, "unreadOffset");
