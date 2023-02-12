import type { SandpackFiles, SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';
import { SandpackCodeEditor, SandpackLayout, SandpackProvider } from '@codesandbox/sandpack-react';
import { githubLight } from '@codesandbox/sandpack-themes';

const SandpackContainer = ({
  template = 'react-ts',
  files
}: {
  template?: SandpackPredefinedTemplate;
  files?: SandpackFiles;
}) => {
  return (
    <SandpackProvider template={template} theme={githubLight} files={files}>
      <SandpackLayout>
        <SandpackCodeEditor showLineNumbers showTabs wrapContent />
      </SandpackLayout>
    </SandpackProvider>
  );
  //   <Sandpack
  //   files={{
  //     "/App.tsx": `export default function App(): JSX.Element {
  //       return <h1>Hello nazha</h1>
  //     }
  //     `,
  //   }}
  //   theme={cyberpunk}
  //   template="react-ts"
  //   options={{
  //       readOnly: false,
  //       showTabs: true,
  //       editorWidthPercentage: 60,
  //       wrapContent: true,
  //       autorun: false,
  //       // showReadOnly: false
  //     }}
  // />
};

export default SandpackContainer;
