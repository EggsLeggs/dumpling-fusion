import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 md:py-8 text-center">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
        Dumpling Dynamo
      </h1>
      <p className="text-muted-foreground mt-2 text-sm md:text-base">
        Discover your next favorite dumpling fusion!
      </p>
    </header>
  );
};

export default Header;
