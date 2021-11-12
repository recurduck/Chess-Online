// import axios from 'axios' for Server

// const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/board' : 'http://localhost:3030/api/board' //for Server

// function query() {
//   return axios.get(BASE_URL).then(res => res.data)
// } //for server

// import { utilService } from "./util-service.js";
// import { storageService } from "./storage-service.js";
import { boardsService } from "./boards-service.js"

const KIT = boardsService.KIT
let gSelectedCell = null;



export const boardService = {
  cellClicked,
  onReset
}

function onReset() {
  localStorage.clear()
  window.location.reload()
}

function cellClicked(cellI, cellJ, game, userId) {
  let board = game.gameBoard
  if (userId === (game.whiteTurn ? game.whitePlayer.user._id : game.blackPlayer.user._id)) {
    // if the target is marked - move the piece!
    const cellCoord = { i: cellI, j: cellJ };
    if (board[cellI][cellJ].isMarked) {
      game = boardsService.onMovePiece(game._id, gSelectedCell, cellCoord, board)
      _cleanBoard(board);
      return game;
    }
    if (_isEmptyCell(cellCoord, board)) return
    _cleanBoard(board);
    board[cellI][cellJ].isSelected = true
    gSelectedCell = cellCoord;
    const { piece } = board[cellI][cellJ];
    let possibleCoords = _getAllPossibleCoords(piece, cellCoord, game);
    possibleCoords = possibleCoords.filter(toCoord => !_nextStepModal(cellCoord, toCoord, game))
    markCells(possibleCoords, board);
    return game;
  }
}

function markCells(coords, board) {
  coords.forEach(coord => {
    board[coord.i][coord.j].isMarked = true
  });
}

//return false if in the next step the king is still checked
function _nextStepModal(fromCoord, toCoord, game) {
  let nextStepBoard = JSON.parse(JSON.stringify(game.gameBoard))
  let piece = nextStepBoard[fromCoord.i][fromCoord.j].piece;
  let newWhiteKingPos = game.whitePlayer.kingPos;
  let newBlackKingPos = game.blackPlayer.kingPos;
  // update the NEXT STEP MODEL
  nextStepBoard[fromCoord.i][fromCoord.j].piece = '';
  nextStepBoard[toCoord.i][toCoord.j].piece = _isPawnAQueen(toCoord, piece);
  nextStepBoard[toCoord.i][toCoord.j].isWhite = nextStepBoard[fromCoord.i][fromCoord.j].isWhite;
  nextStepBoard[fromCoord.i][fromCoord.j].isWhite = undefined
  if (piece === KIT.KING_WHITE) newWhiteKingPos = { i: toCoord.i, j: toCoord.j }
  else if (piece === KIT.KING_BLACK) newBlackKingPos = { i: toCoord.i, j: toCoord.j }
  return _isCheck(!game.whiteTurn ? newBlackKingPos : newWhiteKingPos, game.whiteTurn, nextStepBoard, game)
}


function _isCheck(pieceCoord, against, board, game) {
  let threatningPieces = []
  if (_kingIsAround(pieceCoord, against, board)) threatningPieces.push(..._kingIsAround(pieceCoord, against, board))
  if (_pawnIsAround(pieceCoord, against, board, game)) threatningPieces.push(..._pawnIsAround(pieceCoord, against, board, game));
  let res = _getAllPossibleCoordsRook(pieceCoord, board, game.whiteTurn)
  for (let i = 0; i < res.length; i++) {
    let posCoord = { i: res[i].i, j: res[i].j }
    let piece = board[posCoord.i][posCoord.j].piece
    if ((piece === KIT.ROOK_BLACK || piece === KIT.ROOK_WHITE ||
      piece === KIT.QUEEN_BLACK || piece === KIT.QUEEN_WHITE) && !_isWhitePiece(posCoord, board) === against) {
      threatningPieces.push(posCoord);
    }
  }
  res = _getAllPossibleCoordsBishop(pieceCoord, board, game.whiteTurn)
  for (let i = 0; i < res.length; i++) {
    let posCoord = { i: res[i].i, j: res[i].j }
    let piece = board[posCoord.i][posCoord.j].piece
    if ((piece === KIT.BISHOP_BLACK || piece === KIT.BISHOP_WHITE ||
      piece === KIT.QUEEN_BLACK || piece === KIT.QUEEN_WHITE) && !_isWhitePiece(posCoord, board) === against) {
      threatningPieces.push(posCoord);
    }
  }
  res = _getAllPossibleCoordsKnight(pieceCoord, board, game.whiteTurn)
  for (let i = 0; i < res.length; i++) {
    let posCoord = { i: res[i].i, j: res[i].j }
    let piece = board[posCoord.i][posCoord.j].piece
    if ((piece === KIT.KNIGHT_BLACK || piece === KIT.KNIGHT_WHITE) && !_isWhitePiece(posCoord, board) === against) {
      threatningPieces.push(posCoord);
    }
  }
  return (threatningPieces.length) ? threatningPieces : false
}

function _pawnIsAround(coord, against, board, game) {
  let res = []
  let pawnCoord = { i: (against) ? coord.i - 1 : coord.i + 1, j: coord.j };
  if (against === game.whiteTurn) {
    for (let j = - 1; j <= 1; j++) {
      let currPawn = { i: pawnCoord.i, j: pawnCoord.j + j }
      if ((currPawn.j < 8 && currPawn.j >= 0) && !_isEmptyCell(currPawn, board) && ((board[currPawn.i][currPawn.j].piece === (!against ? KIT.PAWN_WHITE : KIT.PAWN_BLACK)))) {
        let option = [..._getAllPossibleCoordsPawn(currPawn, !against, board, game)].find(obj => obj.i === coord.i && obj.j === coord.j);
        if (option) res.push(currPawn)
      }
    }
  } else {
    if (coord.i < 1 || coord.i > 6) return false
    if (pawnCoord.j > 0)
      if (board[pawnCoord.i][pawnCoord.j - 1].piece === ((against) ? KIT.PAWN_BLACK : KIT.PAWN_WHITE)) res.push({ i: pawnCoord.i, j: pawnCoord.j - 1 })
    if (pawnCoord.j < 7)
      if (board[pawnCoord.i][pawnCoord.j + 1].piece === ((against) ? KIT.PAWN_BLACK : KIT.PAWN_WHITE)) res.push({ i: pawnCoord.i, j: pawnCoord.j + 1 })
  }
  return res.length ? res : false;
}


function _kingIsAround(coord, against, board) {
  let res = []
  for (let i = coord.i - 1; i <= coord.i + 1; i++) {
    if (i < 0 || i >= 8) continue;
    for (let j = coord.j - 1; j <= coord.j + 1; j++) {
      if (i === coord.i && j === coord.j) continue;
      if (j < 0 || j >= 8) continue;
      let aroundCoord = { i: i, j: j };
      if (!_isEmptyCell(aroundCoord, board) && _isWhitePiece(aroundCoord, board) === against) continue;
      if (board[i][j].piece === ((against) ? KIT.KING_BLACK : KIT.KING_WHITE)) res.push(aroundCoord)
    }
  }
  return res.length ? res : false
}


function _getAllPossibleCoords(piece, cellCoord, game) {
  let possibleCoords = []
  if (game.whiteTurn) {
    switch (piece) {
      case KIT.ROOK_WHITE:
        possibleCoords = _getAllPossibleCoordsRook(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.BISHOP_WHITE:
        possibleCoords = _getAllPossibleCoordsBishop(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.KNIGHT_WHITE:
        possibleCoords = _getAllPossibleCoordsKnight(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.PAWN_WHITE:
        possibleCoords = _getAllPossibleCoordsPawn(cellCoord, game.whiteTurn, game.gameBoard, game);
        break;
      case KIT.QUEEN_WHITE:
        possibleCoords = _getAllPossibleCoordsQueen(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.KING_WHITE:
        possibleCoords = _getAllPossibleCoordsKing(cellCoord, game);
        break;
      default: return possibleCoords

    }
  } else {
    switch (piece) {
      case KIT.ROOK_BLACK:
        possibleCoords = _getAllPossibleCoordsRook(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.BISHOP_BLACK:
        possibleCoords = _getAllPossibleCoordsBishop(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.KNIGHT_BLACK:
        possibleCoords = _getAllPossibleCoordsKnight(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.PAWN_BLACK:
        possibleCoords = _getAllPossibleCoordsPawn(cellCoord, game.whiteTurn, game.gameBoard, game);
        break;
      case KIT.QUEEN_BLACK:
        possibleCoords = _getAllPossibleCoordsQueen(cellCoord, game.gameBoard, game.whiteTurn);
        break;
      case KIT.KING_BLACK:
        possibleCoords = _getAllPossibleCoordsKing(cellCoord, game);
        break;
      default: return possibleCoords
    }
  }
  return possibleCoords;
}


function _getAllPossibleCoordsPawn(pieceCoord, against, board, game) {
  let res = [];
  let isWhite = board[pieceCoord.i][pieceCoord.j].piece === KIT.PAWN_WHITE
  let diff = (isWhite) ? -1 : 1;
  let nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
  let diago1Coord = { i: pieceCoord.i + diff, j: pieceCoord.j + 1 }
  let diago2Coord = { i: pieceCoord.i + diff, j: pieceCoord.j - 1 }
  if (((diago1Coord.j < 8 && !_isEmptyCell(diago1Coord, board) && (_isWhitePiece(diago1Coord, board) !== against)) ||
    _isEnPassant(diago1Coord, pieceCoord, against, isWhite, board, game)) && pieceCoord.j + 1 < 8)
    res.push(diago1Coord)
  if (((diago2Coord.j >= 0 && !_isEmptyCell(diago2Coord, board) && (_isWhitePiece(diago2Coord, board) !== against)) ||
    _isEnPassant(diago2Coord, pieceCoord, against, isWhite, board, game)) && pieceCoord.j - 1 >= 0)
    res.push(diago2Coord)
  if (_isEmptyCell(nextCoord, board) && against === game.whiteTurn) res.push(nextCoord);
  else return res;
  if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
    diff *= 2;
    nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (_isEmptyCell(nextCoord, board)) res.push(nextCoord);
  }
  return res;
}


function _isEnPassant(diagoCoord, pieceCoord, against, isWhite, board, game) {
  if (game.blackPlayer.lastMove.fromCoord === null || diagoCoord.j > 7 || diagoCoord.j < 0) return false
  return (_isEmptyCell(diagoCoord, board) &&
    ((pieceCoord.i === 3 && isWhite) || (pieceCoord.i === 4 && !isWhite)) &&
    (board[pieceCoord.i][diagoCoord.j].piece === (!against ? KIT.PAWN_WHITE : KIT.PAWN_BLACK)) &&
    (isWhite ? (game.blackPlayer.lastMove.fromCoord.j === game.blackPlayer.lastMove.toCoord.j && Math.abs(game.blackPlayer.lastMove.fromCoord.i - game.blackPlayer.lastMove.toCoord.i) === 2) :
      (game.whitePlayer.lastMove.fromCoord.j === game.whitePlayer.lastMove.toCoord.j && Math.abs(game.whitePlayer.lastMove.fromCoord.i - game.whitePlayer.lastMove.toCoord.i) === 2)) &&
    ((pieceCoord.i === (isWhite ? game.blackPlayer.lastMove.toCoord.i : game.whitePlayer.lastMove.toCoord.i) &&
      diagoCoord.j === (isWhite ? game.blackPlayer.lastMove.toCoord.j : game.whitePlayer.lastMove.toCoord.j))))
}


function _getAllPossibleCoordsRook(pieceCoord, board, whiteTurn) {
  let res = [];
  for (let dir = 0; dir < 4; dir++) {
    for (let i = _getDirection(dir, pieceCoord); (dir % 2 === 0) ? i >= 0 : i < 8; (dir % 2 === 0) ? i-- : i++) {
      let coord = (dir < 2) ? { i, j: pieceCoord.j } : { i: pieceCoord.i, j: i };
      if (!_isEmptyCell(coord, board)) {
        if (_isWhitePiece(coord, board) === whiteTurn) break;
        else {
          res.push(coord);
          break;
        }
      }
      res.push(coord);
    }
  }
  return res;
}


function _getAllPossibleCoordsBishop(pieceCoord, board, whiteTurn) {
  let res = [];
  for (let dir = 0; dir < 4; dir++) {
    let i = pieceCoord.i + (dir < 2 ? -1 : 1);
    for (let idx = pieceCoord.j + (dir % 2 === 0 ? 1 : -1); ((dir < 2) ? (i >= 0) : (i < 8)) && ((dir % 2 === 0) ? (idx < 8) : (idx >= 0)); (dir % 2 === 0) ? idx++ : idx--) {
      let coord = { i: (dir < 2) ? i-- : i++, j: idx };
      if (!_isEmptyCell(coord, board)) {
        if (_isWhitePiece(coord, board) === whiteTurn) break;
        else {
          res.push(coord);
          break;
        }
      }
      res.push(coord);
    }
  }
  return res;
}


function _getDirection(dir, pieceCoord) {
  return ((dir < 2) ? pieceCoord.i : pieceCoord.j) + ((dir % 2 === 0) ? -1 : 1);
}


function _getAllPossibleCoordsQueen(pieceCoord, board, whiteTurn) {
  let diagonals = _getAllPossibleCoordsBishop(pieceCoord, board, whiteTurn)
  return _getAllPossibleCoordsRook(pieceCoord, board, whiteTurn).concat(diagonals)
}


function _getAllPossibleCoordsKnight(pieceCoord, board, whiteTurn) {
  let res = [];
  for (let i = pieceCoord.i - 2; i <= pieceCoord.i + 2; i++) {
    if (i === pieceCoord.i) continue;
    if (i < 0 || i >= 8) continue;
    for (let j = pieceCoord.j - 2; j <= pieceCoord.j + 2; j++) {
      if (i === pieceCoord.i && j === pieceCoord.j) continue;
      if (j < 0 || j >= 8) continue;
      let coord = { i: i, j: j };
      if (!_isEmptyCell(coord, board) && _isWhitePiece(coord, board) === whiteTurn) continue;
      if ((Math.abs(pieceCoord.i - i) + Math.abs(pieceCoord.j - j)) === 3) res.push(coord);
    }
  }
  return res;
}


function _getAllPossibleCoordsKing(pieceCoord, game) {
  let res = [];
  let board = game.gameBoard
  for (let i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
    if (i < 0 || i >= 8) continue;
    for (let j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
      if (i === pieceCoord.i && j === pieceCoord.j) continue;
      if (j < 0 || j >= 8) continue;
      let coord = { i: i, j: j };
      if (!_isEmptyCell(coord, board) && _isWhitePiece(coord, board) === game.whiteTurn) continue;
      if (_isCheck(coord, game.whiteTurn, game.gameBoard, game)) continue;
      res.push(coord);
      if ((j === 5 || j === 3) && (i === 0 || i === 7)) {
        _getPossibleCasteling(game, coord, res)
      }
    }
  }
  return res;
}


function _getPossibleCasteling(game, coord, res) {
  let board = game.gameBoard
  if (game.whiteTurn && !game.whitePlayer.kingMoved) {
    if (coord.j === 5 && _isEmptyCell({ i: coord.i, j: coord.j + 1 }, board) &&
      !_isCheck({ i: coord.i, j: coord.j + 1 }, game.whiteTurn, board, game))
      res.push({ i: coord.i, j: coord.j + 1 })
    else if (_isEmptyCell({ i: coord.i, j: coord.j - 1 }, board) &&
      !_isCheck({ i: coord.i, j: coord.j - 1 }, game.whiteTurn, board, game))
      res.push({ i: coord.i, j: coord.j - 1 })
  } else if (!game.whiteTurn && !game.whitePlayer.kingMoved) {
    if (coord.j === 5 && _isEmptyCell({ i: coord.i, j: coord.j + 1 }, board) &&
      !_isCheck({ i: coord.i, j: coord.j + 1 }, game.whiteTurn, board, game))
      res.push({ i: coord.i, j: coord.j + 1 })
    else if (_isEmptyCell({ i: coord.i, j: coord.j - 1 }, board) &&
      !_isCheck({ i: coord.i, j: coord.j - 1 }, game.whiteTurn, board, game))
      res.push({ i: coord.i, j: coord.j - 1 })
  }
}


function _isEmptyCell(coord, board) {
  return board[coord.i][coord.j].piece === ''
}


function _isWhitePiece(coord, board) {
  return board[coord.i][coord.j].isWhite
}


function _isPawnAQueen(coord, piece) {
  if (piece === KIT.PAWN_BLACK && coord.i === 7) return KIT.QUEEN_BLACK
  else if (piece === KIT.PAWN_WHITE && coord.i === 0) return KIT.QUEEN_WHITE
  else return piece
}


function _cleanBoard(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j].isMarked) board[i][j].isMarked = false
      if (board[i][j].isSelected) board[i][j].isSelected = false
    }
  }
}