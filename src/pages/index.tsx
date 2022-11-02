
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import avatarImg from "../assets/avatares.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../services/api";
import { FormEvent, useState } from "react";


interface HomeProps{
  guessCount: number;
  poolCount: number;
  userCount: number;
}

export default function Home({guessCount=0,poolCount=0,userCount=0}:HomeProps) {

  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(event:FormEvent){
    event.preventDefault();
    try{
      const response = await api.post("/pools",{
        title: poolTitle
      })
      const {code} = response.data;
      setPoolTitle("");
      await navigator.clipboard.writeText(code);
      alert("Bolão criado com sucesso, o código foi copiado para a área de transferência!");
    }catch(err){
      console.log(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" quality={100} />
        <h1 className="mt-14 text-white text-4xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className="mt-8 flex items-center gap-2">
          <Image src={avatarImg} alt="" quality={100} />
          <strong className="text-gray-100 text-base">
            <span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-8 flex gap-2">
          <input type="text" value={poolTitle} required placeholder="Qual nome do seu bolão?" onChange={event => setPoolTitle(event.target.value)}
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-300"/>
          <button type="submit" 
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700">Criar meu bolão</button>
        </form>

        <p className="mt-3 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-8 pt-8 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-5">
            <Image src={iconCheckImg} alt="" quality={100}/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"/>
          <div className="flex items-center gap-5">
            <Image src={iconCheckImg} alt="" quality={100}/>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image className="h-[80%] w-[80%]" src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" quality={100} />
    </div>
  )
}

export const getStaticProps = async () => {

  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count")

  ])

  return {
    props:{
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 1 * 1 //1 Minutes
  }
}
