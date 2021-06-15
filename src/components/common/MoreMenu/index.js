// import React, { useState, useEffect } from 'react'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'

// const MoreMenu = (props) => {
//   const {
//     open,
//     onClose,
//     anchor,
//     items,
//     className,
//   } = props

//   const [callFunc, setcallFunc] = useState()

//   const handleMenuClosing = (onClick) => () => {
//     onClose()
//     setcallFunc(onClick)
//   }
 
//   useEffect(() => {
//     callFunc
//   }, [open])

//   return (
//     <Menu
//       style={{ zIndex: 3500 }}
//       anchorEl={() => anchor.current}
//       open={open}
//       onClose={onClose}
//       className={className}
//       transformOrigin={{vertical: 'bottom', horizontal: 'top'}}
//     >
//       {items.map(({onClick, text}) => (
//         <MenuItem onClick={handleMenuClosing(onClick)}>{text}</MenuItem>
//       ))}
//     </Menu>
//   )
// }

// export default MoreMenu