'use strict';

const { response } = require('express');
const path = require('path');
const mongoose= require('mongoose');
const User = mongoose.model('User');
const Messages = mongoose.model('Messages')
class Socket{

	constructor(socket){
		this.io = socket;
	}
	insertMessages(messagePacket){
		return new Promise( async (resolve, reject) => {
			try {
                const message = new Messages(messagePacket)
                message.save().then(data => resolve(data)).catch(err=>rejetc(err));
			} catch (error) {
				reject(error)
			}
		});
	}
	socketEvents(){
1
		this.io.on('connection', (socket) => {

			/* Get the user's Chat list	*/
			socket.on(`chat-list`, async (data) => {
				if (data.userId == '') {
					this.io.emit(`chat-list-response`, {
						error : true,
						message : "user not found"
					});
				}else{
					try {
						const chatlistResponse = await new Promise( async (resolve, reject) => {
                                try {
                                    User.find({socketId: socket.id})
                                    .populate('following')
                                    .then(data => {
                                        if(!data) 
                                        reject("no data")
                                        else
                                        resolve(data[0].following)
                                    })
                                    .catch(err => reject(err))
                                } catch (error) {
                                    reject(error)
                                }
                            })
						this.io.to(socket.id).emit(`chat-list-response`, {
							error : false,
							singleUser : false,
							chatList : chatlistResponse
						});
						
					} catch ( error ) {
                        console.log(error)
						this.io.to(socket.id).emit(`chat-list-response`,{
							error : true ,
							chatList : []
						});
					}
				}
			});

			/**
			* send the messages to the user
			*/
			socket.on(`add-message`, async (data) => {
				if (data.message === '') {
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: "MESSAGE_NOT_FOUND"
					}); 
				}else if(data.fromUserId === ''){
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: "SERVER_ERROR_MESSAGE"
					}); 
				}else if(data.toUserId === ''){
					this.io.to(socket.id).emit(`add-message-response`,{
						error : true,
						message: "SELECT_USER"
					}); 
				}else{
					try{
						const [toSocketId, messageResult ] = await Promise.all([
                            new Promise( async (resolve, reject) => {
                                try {
                                    User.find({_id: data.toUserId})
                                    .then(result=> {
                                        console.log(result)
                                        resolve(result[0]['socketId'])
                                    }).catch(err=> reject(err));
                                } catch (error) {
                                    console.log(error)
                                    reject(error)
                                }
                            }),
							this.insertMessages(data)						
                        ]);

						this.io.to(toSocketId).emit(`add-message-response`,data); 
					} catch (error) {
                        console.log(error)
						this.io.to(socket.id).emit(`add-message-response`,{
							error : true,
							message : "MESSAGE_STORE_ERROR"
						}); 
					}
				}				
			});


			/**
			* Logout the user
			*/
			/*socket.on('logout', async (data)=>{
				try{
					const userId = data.userId;
					await queryHandler.logout(userId);
					this.io.to(socket.id).emit(`logout-response`,{
						error : false,
						message: CONSTANTS.USER_LOGGED_OUT,
						userId: userId
					});

					socket.broadcast.emit(`chat-list-response`,{
						error : false ,
						userDisconnected : true ,
						userid : userId
					});
				} catch (error) {
					console.log(error);
					this.io.to(socket.id).emit(`logout-response`,{
						error : true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE,
						userId: userId
					});
				}
			});

            */
			/**
			* sending the disconnected user to all socket users. 
			*/
			socket.on('disconnect',async () => {
				socket.broadcast.emit(`chat-list-response`,{
					error : false ,
					userDisconnected : true ,
					userid : socket.request._query['userId']
				});
				
			});

		});

    }
    
    addSocketId({userId, socketId}){
        User.findOneAndUpdate({_id: userId},{$set: {socketId: socketId}})
        .then(data=>console.log(data))
    }
	socketConfig(){
		this.io.use( async (socket, next) => {
			try {
				await this.addSocketId({
					userId: socket.request._query['userId'],
					socketId: socket.id
				});
				next();
			} catch (error) {
          		// Error
          		console.error(error);
          	}
          });

		this.socketEvents();
	}
}
module.exports = Socket;