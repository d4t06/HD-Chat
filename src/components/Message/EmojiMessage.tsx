import HTMLReactParser from 'html-react-parser/lib/index';

type Props = {
   message: Message;
};

export default function EmojiMessage({ message }: Props) {
   return <p className='text-[40px]'>{HTMLReactParser(message.content)}</p>;
}
