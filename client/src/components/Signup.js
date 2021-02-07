import React,{Component} from 'react'
import M from 'materialize-css'
import axios from 'axios'
class Signup extends Component{
    state= {
        name:"",
        email:"",
        password:"",
        file: ""
    }
    componentDidMount(){
        document.querySelector('.hello').style.display = 'none';
    }
    handleClick=  e=>{ 
        e.preventDefault();
        var data = new FormData();
        data.append("file",this.state.file);
        data.append('upload_preset', 'InstaClone');
        data.append('cloud_name', 'ds1pvmjev');
        fetch('https://api.cloudinary.com/v1_1/ds1pvmjev/image/upload',{
            method:'POST',
            body: data
        }).then(data=>data.json()).then(async data => {
            try {
                const res = await axios.post('/signup',JSON.stringify({name: this.state.name, email:this.state.email, password:this.state.password,photo: data.url}), {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(res);
                M.toast({ html: res.data.message, classes: '#42a5f5 blue lighten-1' });
            } catch(err) {
                console.log("!")
                M.toast({ html: err, classes: 'rounded #f44336 red' })
            }
        })
        
    }
    render() {
    return (
        <div className="mycard">
        <div class="card-panel signin input-field">
            <h3>Instagram</h3>
            <input type="text" placeholder="name" value={this.state.name} onChange={e=>{this.setState({name: e.target.value})}}/>
            <input type="text" placeholder="email" value={this.state.email} onChange={e=>{this.setState({email: e.target.value})}}/>
            <input type="password" placeholder="password" value={this.state.password} onChange={e=>{this.setState({password: e.target.value})}}/>
            <div className="file-field input-field">
                    <div className="btn #64b6f6 blue darken-1" style={{borderRadius:"3px"}}>
                        <span>Upload</span>
                        <input type="file" onChange={(e)=> {this.setState({file: e.target.files[0]})}}/>
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" />
                    </div>
            </div>
            <a className="waves-effect waves-light btn-small mybtn" onClick={(e)=>{this.handleClick(e)}}>Sign Up</a>
      </div>
      </div>
    )
}
}

export default Signup;