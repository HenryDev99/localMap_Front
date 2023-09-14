import { useParams } from 'react-router-dom'
import ic_menu from '../../assets/images/ic _menu_.svg' 
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { UserState } from '../../reducers/userReducer'
import MainCard from '../../components/mainCard'
import { useState } from 'react'
import Spinner from "../../assets/images/spinner.gif";
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk'
import marker from '../../assets/images/ic_map_pin.png'
import StoreCard from '../../components/storeCard'
import PageNation from '../../components/pagenation'
import { QueryKey, UseQueryOptions, useQueries } from "react-query";
import { getEventLocalStore, getEditorProposal } from "../../apis/mainApi";
import { mainApiVO, storeInfoDTO, editorProposalDTO } from "../../types/main/mainTypes";

const EventList = () => {

  const params = useParams()
  const userState = useSelector(
    (state: RootState) => state.userReducer as UserState
  )
  const [offset, setOffset] = useState(0)
  const showFilter = () => {
    alert('aa')
  }

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
      queryFn: fetchAndSetEventStore,
      staleTime: Infinity,
    },
    {
        queryKey: ["editor", 2],
        queryFn: fetchAndSetEditorProposal,
        staleTime: Infinity,
      },
  ];

  const results = useQueries(queries);

  const [isHover1, setHover1] = useState(false);
  const [isHover2, setHover2] = useState(false);
  const [isHover3, setHover3] = useState(false);
  const [isHover4, setHover4] = useState(false);

  
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
  return (
        <div className="searchResultWrapper">
          <div className="srTitleWrapper">
            <p>이벤트 중인 맛집</p>
            <img src={ic_menu} onClick={showFilter} />
          </div>
          <div className="contentWrapper">
            <div className="leftWrapper">
              {results[0].isLoading ? (
              <img src={Spinner} alt="로딩중" width="50%" />
            ) : (
              results[0].data?.results.map((item) => {
                return <MainCard params={item as storeInfoDTO} />;
              })
            )}
            </div>
            <div className="rigthWrapper">
              <Map
                center={{
                  lat: userState.coordinates.lat,
                  lng: userState.coordinates.lng
                }} // 지도의 중심 좌표
                style={{border: '1px solid #f0e0bf',borderRadius: '16px' , paddingLeft: '18px', paddingTop: '10px' ,width: '50rem', height: '41.3rem' }}
                level={3}
              >
                {results[0].data?.results.map((item, index) => {
              return makeMapMarker(item as storeInfoDTO, index);
            })}
              </Map>
              <div className="editCardList">
                {results[0].isLoading ? (
                     <img src={Spinner} alt="로딩중" width="50%" />
                  ) : (
                  results[1].data?.results.map((item) => {
                 return <StoreCard params={item as editorProposalDTO} />;
                 })
                )}
              </div>
            </div>
          </div>
          <PageNation/>
        </div>
      )
}

export default EventList;
