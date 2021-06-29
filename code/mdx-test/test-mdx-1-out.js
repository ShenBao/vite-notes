/* @jsxRuntime classic */
/* @jsx mdx */
import Button from "button";        
export const a = 1;

const layoutProps = {
  a
};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">
    <h1>{`Hello MDX`}</h1>

    <blockquote>
      <p parentName="blockquote">{`will this`}</p>
    </blockquote>
    <ul>
      <li parentName="ul">{`first`}</li>
      <li parentName="ul">{`second`}</li>
    </ul>
    <Button mdxType="Button">This is Button </Button>

    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;