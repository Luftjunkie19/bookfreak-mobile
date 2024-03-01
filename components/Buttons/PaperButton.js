import React from 'react';

import { Button } from 'react-native-paper';

const PaperButton = ({text, mode, icon, bgColor, onPress}) => {
  return (
<Button icon={icon} mode={mode} style={{backgroundColor:bgColor}} onPress={onPress}>
  {text}
</Button>
  )
}

export default PaperButton