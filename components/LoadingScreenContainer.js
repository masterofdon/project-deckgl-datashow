import React,{Component} from 'react';
import LoadingScreenImage from './LoadingScreenImage';

export default class LoadingScreenContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            status : null
        }
    }

    render(){
        const {status} = this.props;
        return(
            <div className={'loading-container loading-' + status}>
                <LoadingScreenImage />
            </div>
        );
    }

}