import { createBrowserRouter } from 'react-router-dom'
import Main from '../pages/main/main'
import Root from '../pages/root'
import Login from '../pages/login/login'
import SearchResult from '../pages/search/searchResult'
import FavList from '../pages/store/favList'
import EventList from '../pages/store/eventList'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Main /> },
      { path: '/login', element: <Login /> },
      { path: '/favlist', element: <FavList/>},
      { path: '/eventlist', element: <EventList/>},
      { path: '/searchResult/:search', element: <SearchResult /> }
    ]
  }
])
