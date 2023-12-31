import { useParams } from 'react-router-dom'
import ic_menu from '../../assets/images/ic _menu_.svg'
import ic_plus from '../../assets/images/ic_plus.svg'
import { getSearchInfo } from '../../apis/searchApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { UserState } from '../../reducers/userReducer'
import { useQuery } from 'react-query'
import MainCard from '../../components/mainCard'
import { storeInfoDTO } from '../../types/main/mainTypes'
import { useState } from 'react'
import Loading from '../../components/loading'
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk'
import marker from '../../assets/images/ic_map_pin.png'

const SearchResult = () => {
  const params = useParams()
  const userState = useSelector(
    (state: RootState) => state.userReducer as UserState
  )
  const [offset, setOffset] = useState(0)
  const showFilter = () => {
    alert('aa')
  }

  const fetchAndSetSearchInfo = async () => {
    const data = await getSearchInfo({
      category: '',
      sort_by: '',
      latitude: userState.coordinates.lat,
      longitude: userState.coordinates.lng,
      search: params.search!,
      limit: 8,
      offset: offset
    })
    console.log(data)
    return data
  }

  const { data, isLoading, error, refetch } = useQuery(
    'location',
    fetchAndSetSearchInfo
  )

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="searchResultWrapper">
          <div className="srTitleWrapper">
            <p>{params.search} 맛집 인기순</p>
            <img src={ic_menu} onClick={showFilter} />
          </div>
          <div className="regWrapper">
            <div className="titleWrapper">
              <p>식당 등록</p>
              <img src={ic_plus} />
            </div>
          </div>
          <div className="contentWrapper">
            <div className="leftWrapper">
              {data?.results.map((item: storeInfoDTO) => {
                return <MainCard params={item} />
              })}
            </div>
            <div className="rigthWrapper">
              <Map
                center={{
                  lat: userState.coordinates.lat,
                  lng: userState.coordinates.lng
                }} // 지도의 중심 좌표
                style={{ width: '51rem', height: '41.3rem' }}
                level={3}
              >
                {data?.results.map((item: storeInfoDTO) => {
                  return (
                    <div>
                      <MapMarker
                        position={{
                          lat: item.latitude,
                          lng: item.longitude
                        }}
                        image={{
                          src: marker,
                          size: { width: 45, height: 40 },
                          options: { offset: new kakao.maps.Point(20, 32) }
                        }}
                        title={item.name}
                        zIndex={10}
                      />
                      <CustomOverlayMap
                        position={{
                          lat: item.latitude,
                          lng: item.longitude
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
                  )
                })}
              </Map>
            </div>
          </div>
          <div className="pagiNationWrapper">
            <div className="pageBtn selected">
              <p>1</p>
            </div>
            <div className="pageBtn">
              <p>2</p>
            </div>
            <div className="pageBtn">
              <p>3</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SearchResult
