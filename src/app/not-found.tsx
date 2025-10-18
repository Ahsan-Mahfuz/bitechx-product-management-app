import Image from 'next/image'

const Custom404 = () => {
  return (
    <div className=" flex items-center justify-center   ">
      <Image
        src="/not-found.svg"
        className=" object-cover max-w-[700px] w-full  object-center"
        alt="404 Image"
        width={5000}
        height={5000}
      />
    </div>
  )
}

export default Custom404
