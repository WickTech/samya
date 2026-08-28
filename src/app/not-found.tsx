import { ButtonLink } from "@/components/ui/button-link";
import { LeafDivider } from "@/components/botanical";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-script text-3xl text-plum">Off the menu.</p>
      <h1 className="mt-2 font-display text-4xl text-plum-deep">
        Page not found
      </h1>
      <LeafDivider className="my-6 w-full max-w-xs" />
      <ButtonLink href="/" variant="primary">
        Back to home
      </ButtonLink>
    </div>
  );
}
