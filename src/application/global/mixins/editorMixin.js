export default {
  methods: {
    getEditorConfig (type) {
      if (type === 'toolbar') {
        return [
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['token', 'hr', 'link', 'custom_btn'],
          ['print', 'fullscreen'],
          [
            {
              label: this.$q.i18n.editor.formatting,
              icon: this.$q.icon.editor.formatting,
              list: 'no-icons',
              options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
            },
            {
              label: this.$q.i18n.editor.fontSize,
              icon: this.$q.icon.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
            },
            {
              label: this.$q.i18n.editor.defaultFont,
              icon: this.$q.icon.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
            },
            'removeFormat'
          ],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          [
            {
              label: this.$q.i18n.editor.align,
              icon: this.$q.icon.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify']
            },
            {
              label: this.$q.i18n.editor.align,
              icon: this.$q.icon.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify']
            }
          ],
          ['undo', 'redo']
        ]
      } else if (type === 'fonts') {
        return {
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana'
        }
      }
    }
  }
}
