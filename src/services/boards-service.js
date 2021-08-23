// import axios from 'axios' for Server

// const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/board' : 'http://localhost:3030/api/board' //for Server

// function query() {
//   return axios.get(BASE_URL).then(res => res.data)
// } //for server

// import { utilService } from "./util-service.js";
import { httpService } from "./httpService.js";
const KEY = 'board';
const KIT = {
  KING_WHITE: '♔',
  QUEEN_WHITE: '♕',
  ROOK_WHITE: '♖',
  BISHOP_WHITE: '♗',
  KNIGHT_WHITE: '♘',
  PAWN_WHITE: '♙',
  KING_BLACK: '♚',
  QUEEN_BLACK: '♛',
  ROOK_BLACK: '♜',
  BISHOP_BLACK: '♝',
  KNIGHT_BLACK: '♞',
  PAWN_BLACK: '♟'
}

export const boardsService = {
  query,
  addBoard,
  deleteBoard,
  getBoardById,
  onMovePiece,
  addPlayerToGame,
  KIT
}

function query(/*filterBy*/) {
  // if (filterBy) {
  //   var { vendor, maxSpeed, minSpeed } = filterBy
  //   maxSpeed = maxSpeed ? maxSpeed : Infinity
  //   minSpeed = minSpeed ? minSpeed : 0
  //   const filteredCars = gBoards.filter(car => {
  //     return car.vendor.includes(vendor) && car.speed > minSpeed && car.speed < maxSpeed
  //   })
  //   return Promise.resolve(filteredCars)
  // }
  return httpService.get(`board`)
}

function deleteBoard(boardId) {
  return httpService.delete(`board/${boardId}`)
}

function addBoard(player1, player2 = null) {
  return httpService.post('board', player1)
}

function getBoardById(boardId) {  
  return httpService.get(`board/${boardId}`)
}

function addPlayerToGame(boardId, playerId) {
  console.log('@@@@@@@@@@@@@',boardId, playerId );
  return httpService.put(`board/${boardId}/${playerId}`, {boardId,playerId})  
}
// function updateBoard(boardId, key, value) {
//   var board = gBoards.find(board => board._id === boardId)
//   board[key] = JSON.parse(JSON.stringify(value));
//   _saveBoardsToStorage();
// }

function onMovePiece(gameId, fromCoord, toCoord, frontBoard) {
  // let game = getBoardById(gameId)
  // if (_validateBoard(frontBoard, game.gameBoard)) {
    // update the MODEL
    // _movePiece(gameId, fromCoord, toCoord)
  // }
  return httpService.put(`board/${gameId}`, {gameId, fromCoord, toCoord, frontBoard})
  // return getBoardById(gameId)
}