type Props = {
   message: Message;
};

export default function StickerMessage({ message }: Props) {
   const classes = {
      image: "w-[90px] h-[90px]",
   };

   return <img className={classes.image} src={message.content} alt="" />;
}
