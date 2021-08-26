import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Typography } from "@material-ui/core";
import { Box } from "@material-ui/core";

export default function Editor(props) {
  return (
    <div>
      <Box display="flex" justifyContent="center">
        <div>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ marginLeft: "3%" }}
          >
            {props.hint}
          </Typography>
          <CKEditor
            id="body"
            editor={ClassicEditor}
            data="<p>Type Here ...</p><Br/><Br/><Br/>"
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Type Here!!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              props.setBody(data);
            }}
          />
        </div>
      </Box>
    </div>
  );
}
