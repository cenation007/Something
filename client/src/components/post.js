import React, {Component} from 'react';
import M from 'materialize-css'
import '../App.css'
import axios from 'axios';
class createPost extends Component {
    state={
        title:"",body:"",file:"",
    } 
    componentDidMount(){
        document.querySelector('.hello').style.display = 'none';
    }
    createPost= e=>{ 
        var data = new FormData();
        data.append("file",this.state.file);
        data.append('upload_preset', 'InstaClone')
        data.append('cloud_name', 'ds1pvmjev')
        fetch('https://api.cloudinary.com/v1_1/ds1pvmjev/image/upload',{
            method:'POST',
            body: data
        })
        .then(data => data.json()).then(result => {
            try {
                const res =axios.post('/createpost',JSON.stringify({title: this.state.title, body: this.state.body, photo:result.url}), {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token')
                    }
                });
                this.props.history.push('/')
            } catch(err) {
                if(err.response.status == 500) {
                    M.toast({html: "There was a problem with the server", classes: 'rounded #f44336 red'});
                } else if(err.response.status == 400){
                    M.toast({html: err.response.data.msg, classes: 'rounded #f44336 red'});
                } else {
                    M.toast({html: "Please fill all the fields", classes: 'rounded #f44336 red'});
                }
            }
        }).catch(err =>console.log(err))
        
    }
    render() {
        return (
            <div className="card input-field" 
            style={{margin: "30px 25%",
                    maxwidth: "400px",
                    padding: "20px",
                    textAlign: "center"
            }}>
                <input type="text" placeholder="title" value={this.state.title} onChange={(e)=> {this.setState({title: e.target.value})}}/>
                <input type="text" placeholder="body" value={this.state.body} onChange={(e)=> {this.setState({body: e.target.value})}}/>
                <div className="file-field input-field">
                    <div className="btn #64b6f6 blue darken-1" style={{borderRadius:"3px"}}>
                        <span>Upload</span>
                        <input type="file" onChange={(e)=> {this.setState({file: e.target.files[0]})}}/>
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" />
                    </div>
                </div>
                <a className="waves-effect waves-light btn-small #64b6f6 blue darken-1" style={{borderRadius:"3px"}} onClick={(e)=>{this.createPost()}}>Post</a>
            </div>
        )
    }
}

export default createPost;