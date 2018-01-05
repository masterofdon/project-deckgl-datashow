import React , {Component} from 'react';

export default class IconPopoverHeader extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {header} = this.props;
        const style = {
            marginTop: '15px',
            marginLeft: '10px',
            position : 'absolute'
        }
        return(
            <div className={'input-group'}>
                <i style={style} className="anticon anticon-search" />
                <input className={'iconpopover-header'} onChange={this.props.onSearch} placeholder={header}/>
            </div>
        );
    }
}