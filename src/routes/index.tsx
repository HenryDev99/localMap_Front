import { createBrowserRouter } from 'react-router-dom'
import Main from '../pages/main/main'
import Root from '../pages/root'
import Login from '../pages/login/login'
import SearchResult from '../pages/search/searchResult'
import FavResult from '../pages/store/favResult'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Main /> },
      { path: '/login', element: <Login /> },
      { path: '/favResult', element: <FavResult/>},
      { path: '/searchResult/:search', element: <SearchResult /> }
    ]
  }
])
