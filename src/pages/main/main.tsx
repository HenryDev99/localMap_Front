import MainCard from "../../components/mainCard";
import MainLaggeCard from "../../components/mainLargeCard";
import MainSearch from "../../components/mainSearch";
import Button from "../../atoms/button";
import MainSeeMoreButton from "../../components/mainSeeMoreButton";
import {
  getEditorProposal,
  getEventLocalStore,
  getNearLocalStore,
} from "../../apis/mainApi";
import {
  storeInfoDTO,
  mainApiVO,
  editorProposalDTO,
} from "../../types/main/mainTypes";
import { QueryKey, UseQueryOptions, useQueries } from "react-query";
import Spinner from "../../assets/images/spinner.gif";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import marker from "../../assets/images/ic_map_pin.png";
import { useState } from "react";
import { UserState } from "../../reducers/userReducer";
import { useNavigate } from 'react-router-dom';

const Main = (): JSX.Element => {
  const userState = useSelector(
    (state: RootState) => state.userReducer as UserState
  );

  const [isHover1, setHover1] = useState(false);
  const [isHover2, setHover2] = useState(false);
  const [isHover3, setHover3] = useState(false);
  const [isHover4, setHover4] = useState(false);

  const fetchAndSetNearStore = async () => {
    const data = await getNearLocalStore({
      category: "",
      sort_by: "",
      latitude: userState.coordinates.lat,
      longitude: userState.coordinates.lng,
      limit: 4,
      offset: 1,
    });
    return data;
  };

  const fetchAndSetEventStore = async () => {
    const data = await getEventLocalStore({
      category: "",
      sort_by: "",
      latitude: userState.coordinates.lat,
      longitude: userState.coordinates.lng,
      limit: 4,
      offset: 1,
    });
    return data;
  };

  const fetchAndSetEditorProposal = async () => {
    const data = await getEditorProposal({
      limit: 4,
      offset: 0,
    });
    return data;
  };

  const queries: UseQueryOptions<mainApiVO, Error, mainApiVO, QueryKey>[] = [
    {
      queryKey: ["near", 1],
      queryFn: fetchAndSetNearStore,
      staleTime: Infinity,
    },
    {
      queryKey: ["event", 2],
      queryFn: fetchAndSetEventStore,
      staleTime: Infinity,
    },
    {
      queryKey: ["editor", 3],
      queryFn: fetchAndSetEditorProposal,
      staleTime: Infinity,
    },
  ];

  const results = useQueries(queries);

  const onMarkerHover = (index: number): void => {
    switch (index) {
      case 0:
        setHover1(true);
        break;
      case 1:
        setHover2(true);
        break;
      case 2:
        setHover3(true);
        break;
      case 3:
        setHover4(true);
        break;
    }
  };

  const onMarkerHoverOut = (index: number) => {
    switch (index) {
      case 0:
        setHover1(false);
        break;
      case 1:
        setHover2(false);
        break;
      case 2:
        setHover3(false);
        break;
      case 3:
        setHover4(false);
        break;
    }
  };

  const makeHoverState = (index: number) => {
    switch (index) {
      case 0:
        return isHover1;
      case 1:
        return isHover2;
      case 2:
        return isHover3;
      case 3:
        return isHover4;
    }
  };

  const makeMapMarker = (item: storeInfoDTO, index: number) => {
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
          onMouseOver={() => onMarkerHover(index)}
          onMouseOut={() => onMarkerHoverOut(index)}
          zIndex={10}
        />
        {makeHoverState(index) ? (
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
        ) : (
          <div />
        )}
      </div>
    );
  };
  const navigate = useNavigate()
  const goFavList = () => {
    navigate("/favlist");
  };
  const goEventList = () => {
    navigate('/eventlist');
  }

  return (
    <div className="mainWrapper">
      <section className="sloganSection">
        <div className="leftWrapper">
          <p className="titleSlogan">원하는 슬로건</p>
          <p className="subTitleSlogan">원하는 부제</p>
          <MainSearch />
        </div>
        <div className="rightWrapper">
          <Map
            center={{
              lat: userState.coordinates.lat,
              lng: userState.coordinates.lng,
            }} // 지도의 중심 좌표
            style={{ width: "51rem", height: "41.3rem" }}
            level={3}
          >
            {results[0].data?.results.map((item, index) => {
              return makeMapMarker(item as storeInfoDTO, index);
            })}
          </Map>
        </div>
      </section>
      <section className="mainContentWrapper">
        <div className="StoreWrapper">
          <p className="mainTitle">주변 인기맛집</p>
          <div className="storeCardList">
            {results[0].isLoading ? (
              <img src={Spinner} alt="로딩중" width="50%" />
            ) : (
              results[0].data?.results.map((item) => {
                return <MainCard params={item as storeInfoDTO} />;
              })
            )}
          </div>
          <Button onClick={goFavList} />
        </div>
        <div className="StoreWrapper">
          <p className="mainTitle">이벤트 중인 맛집</p>
          <div className="storeCardList">
            {results[1].isLoading ? (
              <img src={Spinner} alt="로딩중" width="50%" />
            ) : (
              results[1].data?.results.map((item) => {
                return <MainCard params={item as storeInfoDTO} />;
              })
            )}
          </div>
          <Button onClick={goEventList}/>
        </div>
        <div className="StoreWrapper">
          <p className="mainTitle">에디터 특집</p>
          <div className="editCardList">
            {results[2].isLoading ? (
              <img src={Spinner} alt="로딩중" width="50%" />
            ) : (
              results[2].data?.results.map((item) => {
                return <MainLaggeCard params={item as editorProposalDTO} />;
              })
            )}
          </div>
          <MainSeeMoreButton />
        </div>
      </section>
    </div>
  );
};

export default Main;