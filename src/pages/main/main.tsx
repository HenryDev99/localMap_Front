import { useEffect } from 'react'
import locationIcon from '../../assets/images/ic_header_search.svg'
import searchIcon from '../../assets/images/ic_main_search.svg'
import MainCard from '../../components/mainCard'
import MainLaggeCard from '../../components/mainLargeCard'
import { getEventLocalStore, getNearLocalStore } from '../../apis/mainApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { storeInfoDTO } from '../../types/main/mainTypes'
import { QueryKey, UseQueryOptions, useQueries } from 'react-query'

const Main = (): JSX.Element => {
  const currentLocation = useSelector(
    (state: RootState) => state.userReducer.coordinates
  )

  const fetchAndSetNearStore = async () => {
    const data = await getNearLocalStore({
      category: '',
      sort_by: '',
      //latitude: currentLocation.lat,
      //longitude: currentLocation.lng
      latitude: null,
      longitude: null
    })
    return data
  }

  const fetchAndSetEventStore = async () => {
    const data = await getEventLocalStore({
      category: '',
      sort_by: '',
      //latitude: currentLocation.lat,
      //longitude: currentLocation.lng
      latitude: null,
      longitude: null
    })
    return data
  }

  const queries: UseQueryOptions<
    storeInfoDTO[],
    Error,
    storeInfoDTO[],
    QueryKey
  >[] = [
    {
      queryKey: ['near', 1],
      queryFn: fetchAndSetNearStore,
      staleTime: Infinity
    },
    {
      queryKey: ['event', 2],
      queryFn: fetchAndSetEventStore,
      staleTime: Infinity
    }
  ]

  const results = useQueries(queries)

  useEffect(() => {
    console.log(results)
  }, [])

  return (
    <div className="mainWrapper">
      <section className="sloganSection">
        <div className="leftWrapper">
          <p className="titleSlogan">원하는 슬로건</p>
          <p className="subTitleSlogan">원하는 부제</p>
          <div className="searchWrapper">
            <div className="search">
              <img src={locationIcon} />
              <input type="text" />
            </div>
            <div className="searchButton">
              <img src={searchIcon} />
              <p>검색</p>
            </div>
          </div>
        </div>
        <div className="rightWrapper"></div>
      </section>
      <section className="mainContentWrapper">
        <div className="StoreWrapper">
          <p className="mainTitle">주변 인기맛집(거리순으로)</p>
          <div className="storeCardList">
            {results[0].isLoading ? (
              <p>Loading!!!</p>
            ) : (
              results[0].data!.map((item) => {
                return <MainCard params={item as storeInfoDTO} />
              })
            )}
          </div>
          <div className="seeMoreButton">
            <p>더보기</p>
          </div>
        </div>
        <div className="StoreWrapper">
          <p className="mainTitle">이벤트 중인 맛집</p>
          <div className="storeCardList">
            {results[1].isLoading ? (
              <p>Loading!!!</p>
            ) : (
              results[1].data!.map((item) => {
                return <MainCard params={item as storeInfoDTO} />
              })
            )}
          </div>
          <div className="seeMoreButton">
            <p>더보기</p>
          </div>
        </div>
        <div className="StoreWrapper">
          <p className="mainTitle">에디터 특집</p>
          <div className="editCardList">
            <MainLaggeCard />
            <MainLaggeCard />
            <MainLaggeCard />
            <MainLaggeCard />
          </div>
          <div className="seeMoreButton">
            <p>더보기</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Main
