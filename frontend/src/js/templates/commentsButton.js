import { html, render } from 'lit-html';
import { commentFormTemplate, handleCommentPost } from './commentForm';
import { remToPixels } from '../collaboration/templates';


export let commentsButtonTemplate = (coords, translateY) => {
  let commentWidth = 2.5;
  let commentHeight = 2.5;

  const clickHandler = () => {
    render(
      commentFormTemplate(handleCommentPost),
      document.querySelector('#post-comment .modal-content')
    );
  };

  return html`<div
    style="transform: translate(${coords.left +
    coords.width -
    remToPixels(commentWidth)}px, ${coords.top -
    remToPixels(commentHeight)}px);
  width: ${commentWidth}rem; height: ${commentHeight}rem; cursor: pointer; position: absolute; pointer-events: all;"
    class="p-2"
    data-toggle="modal" data-target="#post-comment" @click=${clickHandler}
  >
    <svg xmlns="http://www.w3.org/2000/svg" id="comment-create-svg" width="28" height="28" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
      <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
      <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
    </svg>
    </div>`;
};