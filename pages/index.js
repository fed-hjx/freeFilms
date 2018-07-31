import React from 'react'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

export default class Page extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://127.0.0.1:3000/getuser')
        // const statusCode = res.statusCode > 200 ? res.statusCode : false
        const data = await res.json()
        return {data}
    }
    constructor() {
        super()
        this.state = {
            data: null,
            pageIndex: 2 
        }
    }
    handleClick = async () =>{
        const res = await fetch(`http://127.0.0.1:3000/getuser?pageIndex=${this.state.pageIndex}`)
        // const statusCode = res.statusCode > 200 ? res.statusCode : false
        const data = await res.json()
        this.state.pageIndex++
        this.setState({
            data: data
        })
    }
    render() {
        // if (this.props.statusCode) {
        //     return <Error statusCode={this.props.statusCode} />
        // }
        let data = this.state.data || this.props.data;
        console.log(this.state)
        return (
            <div>
                <Link href="/about">
                    <a>About</a>
                </Link>
                <p onClick={this.handleClick}>Hello World</p>
                {
                    data.films.map((v,i) => {
                        return (<div key={i}>
                                    <a href={v.url}>
                                        <img src={v.imgUrl}/>
                                        <span>{v.name}</span>
                                        <span>{v.score}</span>
                                    </a>
                                </div>)
                    })
                }
            </div>
        )
    }
}