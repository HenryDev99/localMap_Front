import ic_menu from "../../assets/images/ic _menu_.svg";
import ic_plus from "../../assets/images/ic_plus.svg";
import MainCard from "../../components/mainCard";
import Loading from "../../components/loading";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { QueryKey, UseQueryOptions, useQueries, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { getSearchInfo } from "../../apis/searchApi";
import {
  editorProposalDTO,
  mainApiVO,
  storeInfoDTO,
} from "../../types/main/mainTypes";
import { RootState } from "../../reducers";
import { UserState } from "../../reducers/userReducer";
import StoreCard from "../../components/storecard";
import { useDispatch } from "react-redux";
import { set } from "../../reducers/modalReducer";
import Filter from "../modal/filter";
import { getEditorProposal } from "../../apis/mainApi";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import Spinner from "../../assets/images/spinner.gif";
import marker from "../../assets/images/ic_map_pin.png";
import PagiNation from "../../components/pagiNation";
import EditorCard from "../../components/editorCard";
const SearchResult = () => {
  const params = useParams();
  const userState = useSelector(
    (state: RootState) => state.userReducer as UserState
  );

  //검색결과 조회설정
  const fetchAndSetSearchInfo = async () => {
    const offset = (currentPage - 1) * postsPerPage + 1;
    const data = await getSearchInfo({
      category: "",
      sort_by: "",
      latitude: userState.coordinates.lat,
      longitude: userState.coordinates.lng,
      search: params.search!,
      limit: postsPerPage,
      offset: offset,
    });
    return data;
  };

  //검색결과 가져오기
  const { data, isLoading, error, refetch } = useQuery(
    "location",
    fetchAndSetSearchInfo
  );
  // fetchAndSetEditorProposal 함수 수정
  const fetchAndSetEditorProposal = async () => {
    const offset = (currentPage - 1) * e_postsPerPage + 1;

    const data = await getEditorProposal({
      limit: e_postsPerPage,
      offset: offset,
    });

    return data;
  };

  //현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);

  //조회조건을 가져와 조회한 후 값 가져오기
  const queries: UseQueryOptions<mainApiVO, Error, mainApiVO, QueryKey>[] = [
    {
      queryKey: ["editor", currentPage],
      queryFn: fetchAndSetEditorProposal,
      staleTime: 0,
    },
    {
      queryKey: ["search", currentPage],
      queryFn: fetchAndSetSearchInfo,
      staleTime: 0,
    },
  ];
  //useQueries hook으로 해당 값들 가져옴.
  const results = useQueries(queries);

  //페이지 네이션

  //총 페이지 수
  const totalPages = results[1]?.data?.totalPages;

  //페이지 당 게시물 수
  const [postsPerPage, setPostsPerPage] = useState(6);

  //현재 페이지의 첫번째 게시물 인덱스번호
  const [e_postsPerPage, sete_PostsPerPage] = useState(3);

  const currentPosts = results[1].data?.results.map((item, index) => (
    <MainCard key={index} params={item as storeInfoDTO} />
  ));

  function setPage(page: number) {
    setCurrentPage(page);
  }

  const dispatch = useDispatch();

  const showFilter = () => {
    dispatch(set({ state: "필터모달", cashe1: "캐시1", cashe2: "캐시2" }));
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="searchResultWrapper">
          <div className="srTitleWrapper">
            <p>{params.search} 맛집 인기순</p>
            <img src={ic_menu} onClick={showFilter} />
            <Filter />
          </div>
          <div className="regWrapper">
            <div className="titleWrapper">
              <p>식당 등록</p>
              <img src={ic_plus} />
            </div>
          </div>
          <div className="contentWrapper">
            <div className="leftWrapper">{currentPosts}</div>
            <div className="rigthWrapper">
              <Map
                center={{
                  lat: userState.coordinates.lat,
                  lng: userState.coordinates.lng,
                }} // 지도의 중심 좌표
                style={{ width: "51rem", height: "41.3rem" }}
                level={3}
              >
                {data?.results.map((item: storeInfoDTO) => {
                  return (
                    <div>
                      <MapMarker
                        position={{
                          lat: item.latitude,
                          lng: item.longitude,
                        }}
                        image={{
                          src: marker,
                          size: { width: 45, height: 40 },
                          options: { offset: new kakao.maps.Point(20, 32) },
                        }}
                        title={item.name}
                        zIndex={10}
                      />
                      <CustomOverlayMap
                        position={{
                          lat: item.latitude,
                          lng: item.longitude,
                        }}
                        yAnchor={0.8}
                        xAnchor={0.1}
                      >
                        <div className="overlayMarker">
                          <div className="titleWrapper">
                            <p>{item.name}</p>
                          </div>
                        </div>
                      </CustomOverlayMap>
                    </div>
                  );
                })}
              </Map>
              <div className="editCardList">
                {results[0].isLoading ? (
                  <img src={Spinner} alt="로딩중" width="50%" />
                ) : (
                  results[0].data?.results.map((item) => {
                    return <StoreCard params={item as editorProposalDTO} />;
                  })
                )}
              </div>
            </div>
          </div>
          <PagiNation
            totalPosts={results[1].data?.results.length}
            postsPerPage={postsPerPage}
            currentPage={currentPage}
            onClickPage={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};

export default SearchResult;
