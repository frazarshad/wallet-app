import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Transfer from './Transfer';
import PurseAmount from './PurseAmount';
import { withApplicationContext } from '../contexts/Application';
import CardItem from './CardItem';
import Card from './Card';
import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';

import './Purses.scss';

// Exported for testing only.
export const PursesWithoutContext = ({
  purses,
  pendingTransfers,
  previewEnabled,
}: any) => {
  const [openPurse, setOpenPurse] = useState(null);

  const handleClickOpen = purse => {
    setOpenPurse(purse);
  };

  const handleClose = () => {
    setOpenPurse(null);
  };

  const Purse = purse => {
    return (
      <CardItem key={purse.id}>
        <div className="Left">
          <ErrorBoundary>
            <PurseAmount
              brandPetname={purse.brandPetname}
              pursePetname={purse.pursePetname}
              value={purse.currentAmount.value}
              displayInfo={purse.displayInfo}
            />
          </ErrorBoundary>
        </div>
        {previewEnabled && (
          <div className="Right">
            {pendingTransfers.has(purse.id) ? (
              <div className="PurseProgressWrapper">
                <CircularProgress size={30} />
              </div>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleClickOpen(purse)}
              >
                Send
              </Button>
            )}
          </div>
        )}
      </CardItem>
    );
  };

  const purseItems = (purses && purses.map(Purse)) ?? (
    <Loading defaultMessage="Fetching purses..." />
  );

  const helptip = (
    <span>
      The smart wallet only supports certain assets and IBC denoms. If you are
      missing assets it may be because they are not supported.{' '}
      <a
        target="supported-assets"
        href="https://docs.inter.trade/inter-protocol-system-documentation/parity-stability-module/supported-assets"
      >
        Please see information on supported assets.
      </a>
    </span>
  );

  return (
    <div>
      <Card header="Purses" helptip={helptip}>
        {purseItems}
      </Card>
      <Transfer purse={openPurse} handleClose={handleClose} />
    </div>
  );
};

export default withApplicationContext(PursesWithoutContext, context => ({
  purses: context.purses,
  pendingTransfers: context.pendingTransfers,
  previewEnabled: context.previewEnabled,
}));
