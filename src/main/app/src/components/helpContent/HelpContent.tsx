import React, {Dispatch, SetStateAction, useState} from 'react';
import './HelpContent.css';

const HelpContent = () => {
    const [copiedJSON, setCopiedJSON] = useState(false);
    const [copiedTxt, setCopiedTxt] = useState(false);

    const handleCopy = (text: string, setType: Dispatch<SetStateAction<boolean>>) => {
        navigator.clipboard.writeText(text).then(() => {
            setType(true);
            setTimeout(() => setType(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Failed to copy text: ', err);
        });
    };

    const jsonExample = `[
  {
    "analysis": "KubeSec analysis",
    "smells": ["UPM"],
    "description": "Kubesec.io found potential problems in deployment_file.yaml selector: .metadata.annotations.'container.apparmor.security.beta.kubernetes.io/nginx' reason: Well defined AppArmor policies may provide greater protection."
  },
  ...
]`;

    const txtExample = `Analysis results:

KubeSec analysis - detected smells {UPM}
\tKubesec.io found potential problems in cartservice.yaml
\tselector: .metadata.annotations."container.apparmor.security.beta.kubernetes.io/nginx"
\treason: Well defined AppArmor policies may provide greater protection.

KubeSec analysis - detected smells {UPM}
\tKubesec.io found potential problems in cartservice.yaml
\tselector: .metadata .annotations ."container.seccomp.security.alpha.kubernetes.io/pod"
\treason: Seccomp profiles set minimum privilege and secure against unknown threats
`;

    return (
        <div>
            <h2 className="helpContent-title">File Format Guide</h2>
            <p>Our system supports <strong>.txt</strong> and <strong>.json</strong> files. Below are the format guidelines:</p>
            <div className="help-section">
                <h3>JSON Format:</h3>
                <div className="example-box">
                    <pre>{jsonExample}</pre>
                    <button className="copy-button" onClick={() => handleCopy(jsonExample, setCopiedJSON)}>
                        {copiedJSON ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            <div className="help-section">
                <h3>Txt Format:</h3>
                <div className="example-box">
                    <pre>{txtExample}</pre>
                    <button className="copy-button" onClick={() => handleCopy(txtExample, setCopiedTxt)}>
                        {copiedTxt ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpContent;
