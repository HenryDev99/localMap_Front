import '../assets/styles/components/storeCard.scss'
import { editorProposalDTO } from '../types/main/mainTypes'

const StoreCard = ({ params }: { params: editorProposalDTO }) => {
  return (
    <div className="StoreCardWrapper" onClick={()=>{console.log('editor info')}}>
      <section className="imageWrapper">
        <img src={params.url} />
      </section>
      <section className="infoWrapper">
        <div className="titleWrapper">
          <p className="title">{params.title}</p>
          <p className="subText">{params.content}</p>
        </div>
      </section>
    </div>
  )
}

export default StoreCard
