import React,{Component} from 'react';

export default class LoadingScreenImage extends Component{

    constructor(props){
        super(props);
    }

    render(){
        const style = {
            marginLeft: '40%' , 
            marginTop: '15%'
        }
        return(<img style={style} src='/assets/img/Wedges.gif' />);
    }

}