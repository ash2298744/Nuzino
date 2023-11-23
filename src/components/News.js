import React,{useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from 'prop-types'

const News = (props)=> {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    // document.title = `${props.category.charAt(0).toUpperCase() + props.category.slice(1)} - Nuzino`;

    const updateNews = async (pageNo) => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=3170dca87c464f7ea2798b6221d7d859&page=${props.page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json()

        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)

        props.setProgress(100);
    }
    useEffect( () => {
        document.title = `${props.category.charAt(0).toUpperCase() + props.category.slice(1)} - Nuzino`;
        updateNews();
    }, [])
 
    // const handlePrevClick = async ()=> {
    //     setPage(page - 1)
    //     updateNews()
    // }

    // const handleNextClick = async ()=> {
    //     setPage(page + 1)
    //     updateNews()
    // }

    const fetchMoreData = async () => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=3170dca87c464f7ea2798b6221d7d859&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };


        return (
            <>
                <h2 className='text-center' style={{margin: '40px 0px', marginTop:'90px'}}>Nuzino - Top Headlines from {props.category.charAt(0).toUpperCase() + props.category.slice(1)}</h2>
                {loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults }
                    loader={<Spinner/>}
                >
                    <div className='container'>
                        <div className="row">
                            {articles.map((element)=>{
                                    return  <div className="col-md-4" key={element.url}>
                                        <NewsItem  title={element.title ? element.title.slice(0,45): ""} description={element.description ? element.description.slice(0,88) : ""} imageUrl={element.urlToImage} newsUrl={element.url}
                                        author={element.author} date={element.publishedAt} source={element.source.name} />
                                    </div>
                        })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
}

News.defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News