import { VariantProps, cva } from "class-variance-authority";

const classes = {
   container: "h-[44px]",
};

const avatarVariant = cva("rounded-[99px] overflow-hidden", {
   variants: {
      size: {
         primary: "h-[44px] w-[44px] text-[24px]",
         small: "h-[40px] w-[40px] text-[22px]",
      },
   },
   defaultVariants: {
      size: "primary",
   },
});

interface Props extends VariantProps<typeof avatarVariant> {
   firstChar: string;
   image_url?: string;
   className?: string;
}

export default function AvatarPlaceholder({ firstChar, image_url, size, className }: Props) {
   return (
      <div className={avatarVariant({ size, className })}>
         {image_url ? (
            <img src={image_url} className="w-full " alt="" />
         ) : (
            <div className="w-full h-full bg-[#e1e1e1] flex items-center justify-center">
               <p className="text-[#666]">{firstChar}</p>
            </div>
         )}
      </div>
   );
}
