export interface PagiNationProps {
    totalPosts: number | undefined;
    postsPerPage: number;
    currentPage: number;
    onClickPage: (page: number) => void;
    totalPages: number | undefined;
  }