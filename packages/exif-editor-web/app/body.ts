import * as common from 'exif-editor-common'
import {html} from 'lit-html'

console.log(common)

function handleImageSelect(e: Event) {
  const reader = new FileReader()
  const input = <HTMLInputElement>e.target

  reader.onload = (re: Event) => {
    console.log(re.target)
  }

  if (input.files && input.files[0]) {
    reader.readAsDataURL(input.files[0])
  }
}

const body = html`<div class="init-input">
  <div class=""></div>
  <input type="file" @change=${handleImageSelect} />
</div>`

export default body