import React, { useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import { View } from 'react-native';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import {
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { List } from '@ui-kitten/components';

import {
  accColor,
  primeColor,
} from '../../../../assets/ColorsImport';
import reuseableTranslations
  from '../../../../assets/translations/ReusableTranslations.json';
import { functions } from '../../../../firebaseConfig';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import useGetDocuments from '../../../../hooks/useGetDocuments';
import { useRanking } from '../../../../hooks/useRanking';
import { useRealDatabase } from '../../../../hooks/useRealDatabase';
import useRealtimeDocument from '../../../../hooks/useRealtimeDocument';
import CommunityListItem from './CommunityListItem';

const CommunityList = ({communityMembers, readerObjects, communityObject,
    expirationTimeNumber,}) => {
      const {user}=useAuthContext();
      const [isPending, setIsPending] = useState(false);
      const selectedLanguage= useSelector((state)=>state.languageSelection.selectedLangugage);
        const {documents:books}=useGetDocuments('books');
        const { getDocument } = useRealtimeDocument();
        const createTransferToWinner= httpsCallable(functions, 'createTransferToWinner');
        const getReadBooks = (id) => {
            return !communityObject?.expiresAt
              ? readerObjects.filter(
                  (reader, i) => reader.id === id && reader.hasFinished
                ).length
              : readerObjects.filter(
                  (reader, i) =>
                    reader.id === id &&
                    reader.hasFinished &&
                    reader.dateOfFinish >= communityObject.createdBy.createdAt &&
                    reader.dateOfFinish <= communityObject.expiresAt
                ).length;
          };
        const {updateDatabase}=useRealDatabase();
          const getlastBookRead = (id) => {
            const BookTitles = !communityObject?.expiresAt
              ? readerObjects.filter(
                  (reader, i) => reader.id === id && reader.hasFinished
                )
              : readerObjects.filter(
                  (reader, i) =>
                    reader.id === id &&
                    reader.hasFinished &&
                    reader.dateOfFinish >= communityObject.createdBy.createdAt &&
                    reader.dateOfFinish <= communityObject.expiresAt
                );
        
            const lastBookTitle = books.filter(
              (book, index) => book.id === BookTitles[index]?.bookReadingId
            )[
              books.filter(
                (book, index) => book.id === BookTitles[index]?.bookReadingId
              ).length - 1
            ]?.title;
        
            return lastBookTitle ? lastBookTitle : "No book yet";
          };

    const {orderedMembers}=useRanking({readerObjects,communityMembers, getReadBooks, getlastBookRead, communityObject, expirationTimeNumber});
  
    const payoutTheWinningUser = async () => {
      setIsPending(true);
      try {
        const winnerDoc = await getDocument("users", orderedMembers[0].id);
        const hostId = await getDocument("users", communityObject.createdBy.id);
  



        if (
          winnerDoc &&
          hostId &&
          communityObject.prize.moneyPrize &&
          !communityObject.prize.itemPrize
        ) {
          const payoutObject = await createTransferToWinner({
            winnerObject: winnerDoc,
            destinationId: winnerDoc.stripeAccountData.id,
            chargeId: communityObject.chargeId,
            amount: communityObject.prize.moneyPrize.amount,
            currency: hostId.stripeAccountData.default_currency.toUpperCase(),
            winnerCurrency:
              winnerDoc.stripeAccountData.default_currency.toUpperCase(),
            communityObject: communityObject,
          });
          const payoutFullfilled = payoutObject.data;
          console.log(payoutFullfilled);
          setIsPending(false);
        }
      } catch (err) {
        setIsPending(false);
        console.log(err);
      }
    };
  
    const confirmClaimingPrize = () => {
      setIsPending(true);
      if (communityObject.prize.itemPrize) {
        updateDatabase(
          { ...communityObject, prizeHandedIn: true },
          "competitions",
          communityObject.id
        );
      }
      setIsPending(false);
    };
  

    return (
    <View>

{user.uid === orderedMembers[0]?.id &&
            expirationTimeNumber <= 0 &&
            !communityObject?.prizeHandedIn &&
            communityObject?.prize?.moneyPrize?.amount > 0 && (
              <Button
              android_ripple={{color:accColor}}
              backgroundColor={primeColor}
              gap={16}
              margin={12}
                onPress={payoutTheWinningUser}>
                  <ButtonText>{reuseableTranslations.claimPrize[selectedLanguage]}</ButtonText>
                  <MaterialCommunityIcons size={24} name='trophy-award' color='white'/>
                </Button>
              
        
            )}
          {!communityObject?.id?.includes("readersClub") &&
            !communityObject?.prizeHandedIn &&
            communityObject?.prize?.itemPrize &&
            user.uid === orderedMembers[0]?.id &&
            expirationTimeNumber <= 0 && (
              <Button 
              android_ripple={{color:accColor}}
              backgroundColor={primeColor}
             gap={16}
              margin={12}
                onPress={confirmClaimingPrize}
              >
              <ButtonText>
                {reuseableTranslations.claimPrize[selectedLanguage]}
              </ButtonText>
                <MaterialCommunityIcons size={24} color='white' name='trophy-award'/>
              </Button>
            )}

    <List contentContainerStyle={{gap:8, padding:6}} data={orderedMembers} renderItem={CommunityListItem}/>
    </View>
  )
}

export default CommunityList