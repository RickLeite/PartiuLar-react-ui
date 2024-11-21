import React from "react";
import "./About.scss";

function About() {
    const teamMembers = [
        { name: "Patrick", photo: "/felipe.png" },
        { name: "Victor", photo: "/felipe.png" },
        { name: "Bruno", photo: "/felipe.png" },
        { name: "Gustavo", photo: "/felipe.png" },
    ];

    return (
        <div className="aboutPage">
            <div className="textContainer">
                <h1 className="title">Sobre Nós</h1>
                <p className="subtitle">
                    <strong>Partiular</strong> nasceu com o objetivo de facilitar a vida de universitários que buscam dividir moradia de forma prática e segura.
                    Nosso compromisso é conectar pessoas com interesses em comum, promovendo convivência harmoniosa e experiências únicas.
                </p>
                <p className="subtitle">
                    Acreditamos que compartilhar um lar vai além de dividir despesas; trata-se de criar laços, aprender com diferentes culturas e vivências, e construir memórias que marcarão uma fase tão especial da vida acadêmica. Com a nossa plataforma, oferecemos uma solução inovadora e intuitiva, que prioriza a segurança e a transparência, ajudando você a encontrar colegas de quarto que realmente combinam com seu estilo de vida e valores.
                </p>
                <p className="subtitle">
                    Nosso time é formado por indivíduos apaixonados por tecnologia, design e inovação, dedicados a criar soluções que realmente fazem a diferença.
                </p>
                <div className="team">
                    <h2>Nosso Time</h2>
                    <div className="teamMembers">
                        {teamMembers.map((member, index) => (
                            <div className="teamMember" key={index}>
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="teamMemberPhoto"
                                />
                                <p>{member.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
