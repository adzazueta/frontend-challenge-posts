const WORDS_LIMIT = 20

const $ = (selector) => document.querySelector(selector)
const textarea = $('#post-textarea')
const wordsCounter = $('#words-counter')
const addButton = $('#add-button')
const saveButton = $('#save-button')
const cleanDataButton = $('#clean-data-button')
const postsList = $('#posts-list')

let postsListArray = []

function trimText(text) {
  const trimmedText = text.trim()
  return trimmedText.replace(/\s+/g, ' ')
}

function countWords(text) {
  const trimmedText = trimText(text)
  return trimmedText.split(' ').length
}

function resetWordsCounter() {
  wordsCounter.innerHTML = `0 / ${WORDS_LIMIT}`
}

function updateWordsCounter(text) {
  const numberOfWords = countWords(text)
  wordsCounter.innerHTML = `${numberOfWords} / ${WORDS_LIMIT}`
}

function isWordsLimitReached(text) {
  const numberOfWords = countWords(text)
  return numberOfWords > WORDS_LIMIT
}

function addTextToPostsList(text) {
  const uuid = crypto.randomUUID()
  const trimmedText = trimText(text)
  const newItem = { text: trimmedText, uuid }
  postsListArray.push(newItem)
  return newItem
}

function removeTextFromPostsList(uuid) {
  postsListArray = postsListArray.filter((post) => post.uuid !== uuid)
}

function addListItem(text) {
  const post = addTextToPostsList(text)
  const listItem = document.createElement('li')
  
  listItem.innerHTML = `
    <span>${post.text}</span>
    <button class="delete-button">Delete</button>
  `

  postsList.appendChild(listItem)

  const deleteButton = listItem.querySelector('.delete-button')
  deleteButton.addEventListener('click', () => {
    removeTextFromPostsList(post.uuid)
    listItem.remove()
  })
}

function renderPostsFromStorage() {
  const temporalPosts = JSON.parse(localStorage.getItem('posts'))
  temporalPosts.forEach((temporalPost) => {
    addListItem(temporalPost.text)
  })
}

textarea.addEventListener('keydown', (event) => {
  const { code, keyCode, target } = event
  const newChar = code !== 'Backspace' ? String.fromCharCode(keyCode) : ''
  const text = target.value + newChar

  if (code === 'Enter') {
    event.preventDefault()
    addButton.click()
  }

  if (isWordsLimitReached(text) && code !== 'Backspace') {
    event.preventDefault()
  } else {
    updateWordsCounter(text)
  }
})

addButton.addEventListener('click', () => {
  addListItem(textarea.value)
  textarea.value = ''
  resetWordsCounter()
})

saveButton.addEventListener('click', () => {
  localStorage.setItem('posts', JSON.stringify(postsListArray))
})

cleanDataButton.addEventListener('click', () => {
  textarea.value = ''
  resetWordsCounter()
  postsListArray = []
  postsList.innerHTML = ''
  localStorage.setItem('posts', JSON.stringify(postsListArray))
})

window.addEventListener('DOMContentLoaded', () => {
  resetWordsCounter()
  renderPostsFromStorage()
})
