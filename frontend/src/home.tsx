import { ReactElement } from "react";

export default function Home():ReactElement {
  return (<>
    <h1>Home Page</h1>
    <CompanyAdvert />
    <CompanyPricing />
    </>);
}

function CompanyAdvert():ReactElement {
  return (
    <>
    <h1>Why you need StockPile</h1>
    <p>
      StockPile grabs data from a number of diiffernt Stock sources and compiles them together into one easy to read data source.  
      This gives you the benefits of multiple different platforms for only one subscription price!
      Also, we provide some novel computational advice that other platforms do not have acces to.
    </p>
    </>
  );
}

function CompanyPricing():ReactElement {
  return (
    <>
    <h1>StockPile is Affordable!</h1>
    <p>
      Stockpile offers a number of pricing plans ranging from Free&trade; plans all the way to the Stock Mogul's Premium Plan.
      Our Free&trade; gives you access to all data already on our servers, but does not include real time updates and new analytics.
      Our Stock Mogul's Premuim Plan includes real time updates, automatic analytics, and any requested analytics.
    </p>
    <small>The Free plan actaully costs $50 USD a month, but we courteously take that fee directly from your monthly earnings first, 
      and only bill if your earnings don't cover the fee.</small>
    </>
  );
}